import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Todo } from '../models/todo';
import { TodoService } from '../services/todo.service';
import { DocumentReference } from '@angular/fire/firestore';
import { TodoViewModel } from '../models/todo-view-model';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {

  todoForm: FormGroup;
  createMode: Boolean = true;
  todo: TodoViewModel;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      done: false
    });

    if (!this.createMode) {
      this.loadTodo(this.todo);
    }
  }

  loadTodo(todo): void{
    this.todoForm.patchValue(todo);
  }

  saveTodo(): void {
    // Validamos el formulario
    if (this.todoForm.invalid) {
      return;
    }

    if (this.createMode){
      const todo: Todo = this.todoForm.value;
      todo.lastModifiedDate = new Date();
      this.todoService.saveTodo(todo)
        .then(response => this.handleSuccessfulSaveTodo(response, todo))
        .catch(err => console.error(err));
    }else{
      const todo: TodoViewModel = this.todoForm.value;
      todo.id = this.todo.id;
      todo.lastModifiedDate = new Date();
      this.todoService.editTodo(todo)
        .then(response => this.handleSuccessfulEditTodo(todo))
        .catch(err => console.error(err));
    }
  }

  handleSuccessfulSaveTodo(response: DocumentReference, todo: Todo): void {
    // Enviar información a todo el list
    this.activeModal.dismiss({todo, id: response.id, createMode: true});
  }
  handleSuccessfulEditTodo(todo: TodoViewModel): void {
    // Enviar información a todo el list
    this.activeModal.dismiss({todo, id: todo.id, createMode: false});
  }

  // close(): void{
  //   this.modalService.dismissAll();
  // }

}
