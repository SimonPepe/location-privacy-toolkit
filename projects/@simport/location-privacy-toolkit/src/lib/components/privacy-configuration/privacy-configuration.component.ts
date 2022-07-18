import { Component } from '@angular/core'
import {
  ILocationOptionType,
  LocationOption,
  LocationOptionTypeIdentifier,
  LocationPrivacyLevel,
  LocationQualityLevel,
} from '../../services/location-management/location-management.types'
import { LocationManagementService } from '../../services/location-management/location-management.service'
import {
  ModalController,
  IonRouterOutlet,
  PopoverController,
} from '@ionic/angular'
import { PrivacyConfigurationDetailComponent } from '../privacy-configuration-detail/privacy-configuration-detail.component'
import { PrivacyConfigurationOptionComponent } from './../privacy-configuration-options/privacy-configuration-options.component'
import { PrivacyConfigurationHistoryComponent } from './../privacy-configuration-history/privacy-configuration-history.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'privacy-configuration',
  templateUrl: 'privacy-configuration.component.html',
  styleUrls: ['privacy-configuration.component.scss'],
})
export class PrivacyConfigurationComponent {
  private locationOptions: LocationOption[] = []

  get currentLocationOptions(): LocationOption[] {
    return this.locationOptions.filter(
      (option) => option.type.isExpertOption == this.isExpertModeActive
    )
  }

  get isExpertModeActive(): Boolean {
    return this.locationManagementService.isExpertMode
  }

  set isExpertModeActive(newValue: Boolean) {
    this.locationManagementService.isExpertMode = newValue
  }

  constructor(
    private locationManagementService: LocationManagementService,
    private modalController: ModalController,
    private popoverCtrl: PopoverController,
    private routerOutlet: IonRouterOutlet,
    private translateService: TranslateService
  ) {
    this.locationManagementService.locationOptions.subscribe(
      (newOptions: LocationOption[]) => {
        this.locationOptions = newOptions
      }
    )
  }

  get privacyLevel(): LocationPrivacyLevel {
    return LocationOption.combinedPrivacyLevel(this.locationOptions)
  }

  get qualityLevel(): LocationQualityLevel {
    return LocationOption.combinedQualityLevel(this.locationOptions)
  }

  get qualityLevelIcons(): RatingIcons {
    const level = this.qualityLevel
    const full = Math.floor(level)
    const empty = Math.floor(LocationQualityLevel.high - level)
    const half = Math.ceil(level - full)
    return new RatingIcons(full, half, empty)
  }

  get privacyLevelIcons(): RatingIcons {
    const level = this.privacyLevel
    const full = Math.floor(level)
    const empty = Math.floor(LocationPrivacyLevel.high - level)
    const half = Math.ceil(level - full)
    return new RatingIcons(full, half, empty)
  }

  getLocationOptionMinLabel(type: ILocationOptionType): string {
    const labels = type.stepLabels ?? []
    return labels.length > 0 ? labels[0] : ''
  }

  getLocationOptionMaxLabel(type: ILocationOptionType): string {
    const labels = type.stepLabels ?? []
    return labels.length > 0 ? labels[labels.length - 1] : ''
  }

  getLocationOptionValueLabel(option: LocationOption): string {
    if (typeof option.value !== 'number') {
      return ''
    }
    const labels = option.type.stepLabels ?? []
    if (labels.length > option.value) {
      return labels[option.value]
    }
    return ''
  }

  async showLocationHistory() {
    const modal = await this.modalController.create({
      component: PrivacyConfigurationHistoryComponent,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
      cssClass: 'auto-height',
    })
    await modal.present()
  }

  async showLocationOptionDetails(type: ILocationOptionType) {
    await this.showDetails(
      type.title,
      type.subtitle,
      type.description,
      type.optionDescription,
      type.icon
    )
  }

  async showLocationHistoryDetails() {
    await this.showDetails(
      'simport-location-privacy-toolkit.location-history.title',
      'simport-location-privacy-toolkit.location-history.subtitle',
      'simport-location-privacy-toolkit.location-history.description',
      'simport-location-privacy-toolkit.location-history.detailDescription',
      'hourglass-outline'
    )
  }

  private async showRatingDetails(
    baseString: string,
    icon: string,
    iconClass?: string
  ) {
    await this.showDetails(
      `simport-location-privacy-toolkit.location-option.rating.${baseString}.title`,
      `simport-location-privacy-toolkit.location-option.rating.${baseString}.subtitle`,
      `simport-location-privacy-toolkit.location-option.rating.${baseString}.description`,
      `simport-location-privacy-toolkit.location-option.rating.${baseString}.detailDescription`,
      icon,
      iconClass
    )
  }

  private async showDetails(
    title: string,
    subtitle: string,
    description: string,
    detailDescription?: string,
    icon?: string,
    iconClass?: string
  ) {
    const modal = await this.modalController.create({
      component: PrivacyConfigurationDetailComponent,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
      cssClass: 'auto-height',
      componentProps: {
        title,
        subtitle,
        description,
        detailDescription,
        icon,
        iconClass,
      },
    })
    await modal.present()
  }

  onLocationOptionChange(option: LocationOption) {
    if (option.type.id == LocationOptionTypeIdentifier.simple) {
      // if simple-options were changed, adjust underlying expert-options accordingly
      const newOptions = this.locationOptions
      newOptions.forEach((o) => {
        if (o.type.isExpertOption) {
          switch (option.value) {
            case option.type.privacyPreset:
              o.value = o.type.privacyPreset
              break
            case option.type.compromisePreset:
              o.value = o.type.compromisePreset
              break
            case option.type.serviceQualityPreset:
              o.value = o.type.serviceQualityPreset
              break
            default:
              break
          }
        }
        return o
      })
      this.locationOptions = newOptions
    }
    this.locationManagementService.locationOptions.next(this.locationOptions)
  }

  async onPrivacyRatingDetailsClick() {
    await this.showRatingDetails('privacy', 'shield')
  }

  async onQualityRatingDetailsClick() {
    await this.showRatingDetails('quality', 'star')
  }

  async onOptionsClick(e: Event) {
    e.stopPropagation()
    const popover = await this.popoverCtrl.create({
      component: PrivacyConfigurationOptionComponent,
      event: e,
      translucent: true,
    })
    return await popover.present()
  }
}

class RatingIcons {
  full: any[]
  half: any[]
  empty: any[]

  constructor(full: number, half: number, empty: number) {
    this.full = new Array(full)
    this.half = new Array(half)
    this.empty = new Array(empty)
  }
}
