import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  @Input() post: Post;
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit( ) {

  }

  onCancelEdit() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onConfirmEdit(form: NgForm) {
    this.modalCtrl.dismiss({post: this.post}, 'confirm');
  }

}
