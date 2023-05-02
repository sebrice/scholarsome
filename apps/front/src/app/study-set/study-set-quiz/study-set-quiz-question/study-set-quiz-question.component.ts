import { Component, Input } from "@angular/core";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { QuizQuestion } from "@scholarsome/shared";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "scholarsome-study-set-quiz-question",
  templateUrl: "./study-set-quiz-question.component.html",
  styleUrls: ["./study-set-quiz-question.component.scss"]
})
export class StudySetQuizQuestionComponent {
  @Input() question: QuizQuestion;
  @Input() parentForm: FormGroup;

  faArrowRight = faArrowRight;
}
