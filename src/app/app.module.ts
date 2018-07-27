import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule} from 'angularfire2/storage';
import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';
import { HttpClientModule } from '@angular/common/http';
import { ValidatorsModule } from '../validators/validators.module';
//native plugins
import { Camera } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
// import { VideoPlayer } from '@ionic-native/video-player';
import { File } from '@ionic-native/file';
import { FilePath} from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { CallNumber } from '@ionic-native/call-number';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { PayPal } from '@ionic-native/paypal';

//others
// import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';
import { FilterPipeModule } from 'ngx-filter-pipe';



let firebaseConfig={
  apiKey: "AIzaSyA8ZvVdZDW76JpAXXhMIljS6wtwNf-yUOg",
  authDomain: "football-union.firebaseapp.com",
  databaseURL: "https://football-union.firebaseio.com",
  projectId: "football-union",
  storageBucket: "football-union.appspot.com",
  messagingSenderId: "1098733280887"
};


import { HelpersProvider } from '../providers/helpers/helpers';
import { SpinnerProvider } from '../providers/spinner/spinner';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    ValidatorsModule,
    HttpClientModule,
    HttpModule,

    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    AuthProvider,
    HelpersProvider,
    SpinnerProvider,
    Camera,
    AndroidPermissions,
    FileChooser,FilePath,File,
    StreamingMedia,,
    Facebook,
    CallNumber,
    PayPal,
    GooglePlus
  ]
})
export class AppModule {}
