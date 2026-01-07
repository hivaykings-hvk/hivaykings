import { Question } from '@/entity/question.entity';

interface UserForQuestion {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
    title: string;
}

export interface QuestionWithUser extends Omit<Question, 'user'> {
    user: UserForQuestion;
}
