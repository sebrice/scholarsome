import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgForm } from "@angular/forms";
import { ModalService } from "../modal.service";
import { AuthService } from "../../auth/auth.service";
import { CookieService } from "ngx-cookie";
import { HttpResponse } from "@angular/common/http";
import { LoginFormCaptcha, RegisterFormCaptcha } from "@scholarsome/shared";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { DeviceDetectorService } from "ngx-device-detector";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "scholarsome-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild("register") registerModal: TemplateRef<HTMLElement>;
  @ViewChild("login") loginModal: TemplateRef<HTMLElement>;

  @ViewChild("loginForm") loginForm: NgForm;
  @ViewChild("registerForm") registerForm: NgForm;

  modalRef?: BsModalRef;
  isMobile: boolean;

  verificationResult: boolean | null;

  loginReq: HttpResponse<LoginFormCaptcha> | number | null;
  registrationReq: HttpResponse<RegisterFormCaptcha> | number | null;

  faGithub = faGithub;
  hidden = false;

  /**
   * @ignore
   */
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly modalService: ModalService,
    private readonly authService: AuthService,
    private readonly deviceService: DeviceDetectorService,
    private readonly router: Router,
    public readonly cookieService: CookieService
  ) {
    this.modalService.modal.subscribe((e) => {
      switch (e) {
        case "register-open":
          this.modalRef = this.bsModalService.show(this.registerModal);
          break;
        case "login-open":
          this.modalRef = this.bsModalService.show(this.loginModal);
          break;
      }
    });
  }

  openModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template);
  }

  async submitLogin(form: NgForm) {
    this.loginReq = 0;
    this.loginReq = await this.authService.login(form.value);

    if (this.loginReq === 200) window.location.assign("homepage");
  }

  async submitRegister(form: NgForm) {
    this.registrationReq = 0;
    this.registrationReq = await this.authService.register(form.value);
  }

  async submitLogout() {
    await this.authService.logout();
    window.location.replace("/");
  }

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.hidden = this.router.url === "/" || this.router.url === "/reset";
      }
    });

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      if (!cookie.includes("verified")) continue;

      this.verificationResult = cookie.includes("true");
    }

    if (this.deviceService.isTablet() || this.deviceService.isMobile()) this.isMobile = true;

    this.bsModalService.onHide.subscribe(() => {
      this.loginReq = null;
      this.registrationReq = null;
      this.verificationResult = null;
    });
  }

  ngAfterViewInit(): void {
    if (this.verificationResult) this.modalRef = this.bsModalService.show(this.loginModal);
  }
}
