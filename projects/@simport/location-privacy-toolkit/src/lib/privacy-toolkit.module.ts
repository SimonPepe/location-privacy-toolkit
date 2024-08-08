import { NgModule } from '@angular/core'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { PrivacyConfigurationComponent } from './components/privacy-configuration/privacy-configuration.component'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { PrivacyConfigurationDetailComponent } from './components/privacy-configuration-detail/privacy-configuration-detail.component'
import { IonicModule } from '@ionic/angular'
import { PrivacyConfigurationOptionComponent } from './components/privacy-configuration-options/privacy-configuration-options.component'
import { PrivacyConfigurationHistoryComponent } from './components/privacy-configuration-history/privacy-configuration-history.component'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { PrivacyConfigurationSharingComponent } from './components/privacy-configuration-sharing/privacy-configuration-sharing.component'
import { AuthService } from './services/auth.service'; // Import AuthService

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [
    PrivacyConfigurationComponent,
    PrivacyConfigurationDetailComponent,
    PrivacyConfigurationOptionComponent,
    PrivacyConfigurationHistoryComponent,
    PrivacyConfigurationSharingComponent,
  ],
  imports: [
    IonicModule,
    FormsModule,
    BrowserModule,
    HttpClientModule, // Add HttpClientModule
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  providers: [AuthService], // Register AuthService
  exports: [PrivacyConfigurationComponent, TranslateModule],
})
export class PrivacyToolkitModule {}
