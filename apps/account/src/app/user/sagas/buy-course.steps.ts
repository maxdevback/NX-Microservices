import {
  CourseGetCourse,
  PaymentCheck,
  PaymentGenerateLink,
  PaymentStatus,
} from '@purple/libs/contracts';
import { PurchaseState } from '@purple/interfaces';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, {
      id: this.saga.courseId,
    });
    if (!course) {
      throw new Error('There is no such course');
    }
    if (course.price == 0) {
      this.saga.setState(PurchaseState.Purchased, course._id);
      return { paymentLink: null, user: this.saga.user };
    }
    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    });
    this.saga.setState(PurchaseState.WaitingForPayment, course._id);
    return { paymentLink, user: this.saga.user };
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error('You cannot check a payment that has not started');
  }
  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return { user: this.saga.user };
  }
}

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error("You can't create a payment link in the process");
  }
  public async checkPayment(): Promise<{
    user: UserEntity;
    status: PaymentStatus;
  }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId,
    });
    if (status === 'canceled') {
      this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
      return { user: this.saga.user, status: 'canceled' };
    }
    if (status === 'success') {
      return { user: this.saga.user, status: 'success' };
    }
    this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    return { user: this.saga.user, status: 'progress' };
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error("You can't cancel a payment in the process");
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error("You can't pay for a purchased course");
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error(
      'It is not possible to check the payment at the purchased rate'
    );
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error("You can't cancel a purchased course");
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error(
      'It is not possible to check the payment at the canceled rate'
    );
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error("You can't undo a canceled course");
  }
}
