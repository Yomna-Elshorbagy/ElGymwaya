import { Component } from '@angular/core';
import { PlansService } from '../../services/plans/plans.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-plan',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-plan.component.html',
  styleUrl: './add-plan.component.scss',
})
export class AddPlanComponent {
  plans: any = {
    newPlanName: '',
    newPlanDescription: '',
    newPlanFee: 0,
    newPlanProfilePicture: null,
    // newfeatures:''
  };

  constructor(private plansService: PlansService, private route: Router) {}

  addPlan() {
    const formData = new FormData();
    formData.append('title', this.plans.newPlanName);
    formData.append('description', this.plans.newPlanDescription);
    formData.append('fee', this.plans.newPlanFee.toString());
    // formData.append('features', this.plans.newfeatures);

    if (this.plans.newPlanProfilePicture) {
      formData.append(
        'profile_picture',
        this.plans.newPlanProfilePicture,
        this.plans.newPlanProfilePicture.name
      );
    }
    this.plansService.addPlan(formData).subscribe(
      (data) => {
        this.resetPlanForm();
        this.route.navigate(['/plans']);
      },
      (error) => {
        console.error('Error adding plan:', error);
      }
    );
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length) {
      this.plans.newPlanProfilePicture = target.files[0];
    }
  }

  resetPlanForm() {
    this.plans = {
      newPlanName: '',
      newPlanDescription: '',
      newPlanFee: 0,
      newPlanProfilePicture: null,
      // newfeatures:''
    };
  }
}
