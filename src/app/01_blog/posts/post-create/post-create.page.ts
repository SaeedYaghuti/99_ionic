import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.page.html',
  styleUrls: ['./post-create.page.scss'],
})
export class PostCreatePage implements OnInit {
  form: FormGroup;
  mode = 'create';
  postId: string;
  imagePreview: string;
  
  constructor(
    private postsSer: PostsService,
    private loadingCtrl: LoadingController,
    private activRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    //initialaze form
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      'oldImagePath': new FormControl(null, { //to keep oldImagePath in editMode
      }),
    });
    //find we have url '/posts/create' or '/edit/:id' ?
    this.activRoute.paramMap.subscribe(params => {
      //edit/:id
      if(params.has('id')) {
        this.mode = 'edit';
        this.postId = params.get('id');
        this.postsSer.getPost(this.postId).subscribe(
          post => {
            if(!post) return this.showAlert('There is no post with this id');
            this.form.setValue({
              title: post.title,
              content: post.content,
              image: post.imagePath,
              oldImagePath: post.imagePath
            });
            this.imagePreview = post.imagePath;
          },
          err => {
            this.showAlert(err.error.message);
          })
      //posts/create    
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSubmit() {
    if(this.form.invalid) return;
    const newPost = new Post(
      this.postId,
      this.form.value.title,
      this.form.value.content,
      this.form.value.image,
      this.form.value.oldImagePath,
      null
    );
    if(this.mode === 'create') {
      this.loadingCtrl.create({
        message: 'Adding your post to the Cloud...'
      }).then(loadEl => {
        loadEl.present();

        this.postsSer.addPost(newPost)
          .subscribe(
            (addPostResult) => {
              console.log('addPost result: ', addPostResult.data.createPost);
              loadEl.dismiss();
              if(addPostResult.errors) {
                this.alertCtrl.create({
                  message: addPostResult.errors[0].message
                }).then(alertEl => {
                  alertEl.present();
                })
              }
              this.form.reset();
              this.navCtrl.navigateBack('/posts');
            },
            err => {
              console.log('addPost err>: ', err);
              loadEl.dismiss();
            })
      })
    }else{ //this.mode = 'edit'
      this.loadingCtrl.create({
        message: 'Editting your post in the Cloud...'
      }).then(loadEl => {
        loadEl.present();
        // if newPost has File inside 'image' field the 'oldImagePath' is oldImagePath; 
        // if newPost has no File inside 'image' field the imagePath is valid as before; 
        this.postsSer.editPost(newPost)
          .subscribe(
            (editPostResult) => {
              loadEl.dismiss();
              if(editPostResult.errors) {
                this.alertCtrl.create({
                  message: editPostResult.errors[0].message
                }).then(alertEl => {
                  alertEl.present();
                })
              }
              this.form.reset();
              this.navCtrl.navigateBack('/posts');
            },
            err => {
              loadEl.dismiss();
              console.log('$update-Post happend err: ', err);
            }
        );
      })
    }
  }

  onPickedPicture(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    //show image in preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
    
  }
 
  showAlert(errorMessage: string) {
    this.alertCtrl.create({
      header: 'No such post fond',
      message: 'We are unable to find this post. the error is: '+ errorMessage,
      buttons: [{
        text: 'OK'
      }]
    }).then(alertEl => {
      alertEl.present();
      this.navCtrl.navigateBack('/posts');
    })
  }

}
