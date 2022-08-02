import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export default class ForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}