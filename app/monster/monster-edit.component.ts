import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, REACTIVE_FORM_DIRECTIVES, FormControl} from '@angular/forms';
import {MonsterService} from './monster.service';
import {MonsterModel} from './monster.model';
import {UploadDemoComponent} from '../shared/upload-demo/upload-demo.component'

@Component({
  moduleId: module.id,
  // selector: 'monster-edit',
  templateUrl: 'monster-edit.component.html',
  directives: [REACTIVE_FORM_DIRECTIVES, UploadDemoComponent]
})
export class MonsterEditComponent implements OnInit {

  private frmMonster: FormGroup;
  private monsterToEdit: MonsterModel;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private monsterService: MonsterService) { }

  ngOnInit() {
    console.log('this.route.params', this.route.params);
    this.prepareForm();
    this.route.params.subscribe(params => {
        const id = params['id'];
        // This means EDIT mode
        if (id) {
          this.monsterService.get(id)
            .then((monster) =>{

                this.monsterToEdit = monster;
                console.log('in edit, ajax returned : ',  this.monsterToEdit,  this.frmMonster.controls );
                (<FormControl>this.frmMonster.controls['name']).updateValue(monster.name);
                (<FormControl>this.frmMonster.controls['power']).updateValue(monster.power);
            });
        }
      });
  }
  save() {
    const monsterId = (this.monsterToEdit)?  this.monsterToEdit.id : undefined;
    this.monsterService.save(this.frmMonster.value, monsterId)
      .then(()=>{
          this.router.navigate(['/monster']);
      });

  }

  prepareForm() {
     this.frmMonster = this.formBuilder.group({
      name: ['',
              Validators.compose([Validators.required,
                                  Validators.minLength(3),
                                  Validators.maxLength(100)])],
      power: [5, Validators.required]
    });
  }
}
