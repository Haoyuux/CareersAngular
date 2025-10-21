import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import {
  ApplicantdataDto,
  GetAllJobPostsDto,
  HrmsServices,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { FormsModule } from '@angular/forms';
import { authService } from 'src/app/services/auth-services/auth-services';
import { LoadingService } from 'src/app/services/auth-services/loading-services';

interface JobPosting {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  tags: string[];
  theme: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  companyDescription: string;
  stats: {
    employees: string;
    users: string;
    countries: string;
  };
}

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss',
})
export class MainDashboardComponent implements OnInit, AfterViewInit {
  // selectedJobId: number = 1;

  constructor(
    private _hrmsService: HrmsServices,
    public authservice: authService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
    private _userService: UserServices
  ) {}
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.onGetJobPosting();
    // this.testSpinner();
  }

  dataApplyJob: ApplicantdataDto = new ApplicantdataDto();
  onApplyJob() {
    this._userService.insertToApplicantMasterList(this.dataApplyJob).subscribe({
      next: (res) => {},
    });
  }

  jobPostData: GetAllJobPostsDto[] = [];
  onGetJobPosting() {
    this.loadingService.show(); // or this.loadingService.loading = true;

    this._hrmsService.getAllJobPosts().subscribe({
      next: (res) => {
        this.jobPostData = res.data;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
      },
    });
  }

  jobPostings: JobPosting[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      logo: 'TC',
      location: '🌍 San Francisco, CA (Remote Available)',
      type: '💼 Full-time',
      salary: '💰 $120,000 - $150,000',
      postedDate: '📅 Posted 2 days ago',
      tags: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      theme: 'tech',
      about:
        "We're seeking a talented Senior Frontend Developer to join our growing engineering team. You'll be responsible for building scalable, user-friendly web applications that serve millions of users worldwide. This role offers the opportunity to work with cutting-edge technologies and collaborate with a world-class team.",
      responsibilities: [
        'Develop and maintain high-quality frontend applications using React and TypeScript',
        'Collaborate with designers and backend engineers to implement pixel-perfect UI/UX designs',
        'Optimize application performance and ensure cross-browser compatibility',
        'Participate in code reviews and maintain coding standards',
        'Mentor junior developers and contribute to technical documentation',
        'Work with product managers to translate business requirements into technical solutions',
      ],
      requirements: [
        '5+ years of experience in frontend development',
        'Expert knowledge of React, JavaScript (ES6+), and TypeScript',
        'Experience with modern CSS frameworks and preprocessors',
        'Familiarity with state management libraries (Redux, Zustand)',
        'Knowledge of testing frameworks (Jest, React Testing Library)',
        'Experience with version control systems (Git)',
        "Bachelor's degree in Computer Science or equivalent experience",
      ],
      niceToHave: [
        'Experience with Node.js and full-stack development',
        'Knowledge of cloud platforms (AWS, Azure, GCP)',
        'Familiarity with GraphQL and REST APIs',
        'Experience with CI/CD pipelines',
        'Contributions to open-source projects',
      ],
      benefits: [
        'Competitive salary and equity package',
        'Health, dental, and vision insurance',
        'Flexible working hours and remote work options',
        'Professional development budget ($3,000/year)',
        'Unlimited PTO policy',
        'Modern office with free meals and snacks',
        'Gym membership reimbursement',
      ],
      companyDescription:
        "TechCorp Solutions is a leading technology company that builds innovative software solutions for businesses worldwide. Founded in 2015, we've grown to over 500 employees across multiple offices and are backed by top-tier investors. Our mission is to democratize technology and make powerful tools accessible to everyone.",
      stats: {
        employees: '500+',
        users: '50M+',
        countries: '15+',
      },
    },
    {
      id: 2,
      title: 'Digital Marketing Manager',
      company: 'Creative Media Inc',
      logo: 'CM',
      location: '🌍 New York, NY (Hybrid)',
      type: '💼 Full-time',
      salary: '💰 $85,000 - $110,000',
      postedDate: '📅 Posted 1 week ago',
      tags: [
        'SEO/SEM',
        'Google Ads',
        'Analytics',
        'Social Media',
        'Content Strategy',
      ],
      theme: 'marketing',
      about:
        "Join our dynamic marketing team as a Digital Marketing Manager! You'll lead comprehensive digital marketing campaigns, drive brand awareness, and optimize our online presence across multiple channels. This role is perfect for a strategic thinker who loves data-driven marketing and creative problem-solving.",
      responsibilities: [
        'Develop and execute comprehensive digital marketing strategies',
        'Manage SEO/SEM campaigns and optimize for ROI',
        'Create and manage social media content calendars',
        'Analyze campaign performance and provide actionable insights',
        'Collaborate with creative team on marketing materials',
        'Lead email marketing campaigns and automation workflows',
      ],
      requirements: [
        '4+ years of digital marketing experience',
        'Proven track record with Google Ads and Facebook Ads',
        'Strong analytical skills with Google Analytics',
        'Experience with marketing automation platforms',
        'Excellent written and verbal communication skills',
        "Bachelor's degree in Marketing, Communications, or related field",
      ],
      niceToHave: [
        'Experience with HubSpot or Salesforce',
        'Knowledge of HTML/CSS basics',
        'Certifications in Google Ads or Facebook Blueprint',
        'Experience with A/B testing platforms',
        'Background in B2B marketing',
      ],
      benefits: [
        'Competitive salary with performance bonuses',
        'Comprehensive health and wellness package',
        'Flexible work arrangements',
        'Marketing conference and training budget',
        '4 weeks paid vacation',
        'Creative workspace in downtown NYC',
        'Team building events and company retreats',
      ],
      companyDescription:
        'Creative Media Inc is an award-winning digital agency that helps brands tell their stories through innovative marketing campaigns. With offices in New York and Los Angeles, we work with Fortune 500 companies and emerging startups to create memorable brand experiences.',
      stats: {
        employees: '200+',
        users: '10M+',
        countries: '8+',
      },
    },
    {
      id: 3,
      title: 'Registered Nurse - ICU',
      company: 'Metro Health Systems',
      logo: 'MH',
      location: '🌍 Chicago, IL (On-site)',
      type: '💼 Full-time / Part-time',
      salary: '💰 $75,000 - $95,000',
      postedDate: '📅 Posted 3 days ago',
      tags: [
        'Critical Care',
        'BSN Required',
        'ACLS Certified',
        'Night Shift',
        'Sign-on Bonus',
      ],
      theme: 'healthcare',
      about:
        "Join our dedicated ICU team at Metro Health Systems! We're looking for a compassionate and skilled Registered Nurse to provide exceptional critical care to our patients. You'll work with state-of-the-art equipment and collaborate with a multidisciplinary team committed to saving lives.",
      responsibilities: [
        'Provide direct patient care in intensive care unit',
        'Monitor and assess critically ill patients',
        'Administer medications and treatments as prescribed',
        'Collaborate with physicians and healthcare team',
        'Educate patients and families about care plans',
        'Maintain accurate patient documentation and records',
      ],
      requirements: [
        'Current RN license in Illinois',
        'BSN degree from accredited nursing program',
        'ACLS and BLS certification required',
        '2+ years of ICU or critical care experience preferred',
        'Strong critical thinking and assessment skills',
        'Excellent communication and interpersonal skills',
      ],
      niceToHave: [
        'CCRN certification',
        'Experience with Epic EMR system',
        'Bilingual English/Spanish',
        'Previous trauma experience',
        'Leadership or charge nurse experience',
      ],
      benefits: [
        'Competitive salary with shift differentials',
        'Comprehensive medical, dental, and vision coverage',
        '$10,000 sign-on bonus for qualified candidates',
        'Tuition reimbursement program',
        'Retirement plan with employer matching',
        'Generous PTO and holiday pay',
        'Professional development opportunities',
      ],
      companyDescription:
        'Metro Health Systems is a leading healthcare provider in the Chicago metropolitan area, serving our community for over 50 years. We operate multiple hospitals and clinics, providing comprehensive medical services with a focus on patient-centered care and clinical excellence.',
      stats: {
        employees: '2,500+',
        users: '500K+',
        countries: '1',
      },
    },
    {
      id: 4,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      logo: 'TC',
      location: '🌍 San Francisco, CA (Remote Available)',
      type: '💼 Full-time',
      salary: '💰 $120,000 - $150,000',
      postedDate: '📅 Posted 2 days ago',
      tags: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      theme: 'tech',
      about:
        "We're seeking a talented Senior Frontend Developer to join our growing engineering team. You'll be responsible for building scalable, user-friendly web applications that serve millions of users worldwide. This role offers the opportunity to work with cutting-edge technologies and collaborate with a world-class team.",
      responsibilities: [
        'Develop and maintain high-quality frontend applications using React and TypeScript',
        'Collaborate with designers and backend engineers to implement pixel-perfect UI/UX designs',
        'Optimize application performance and ensure cross-browser compatibility',
        'Participate in code reviews and maintain coding standards',
        'Mentor junior developers and contribute to technical documentation',
        'Work with product managers to translate business requirements into technical solutions',
      ],
      requirements: [
        '5+ years of experience in frontend development',
        'Expert knowledge of React, JavaScript (ES6+), and TypeScript',
        'Experience with modern CSS frameworks and preprocessors',
        'Familiarity with state management libraries (Redux, Zustand)',
        'Knowledge of testing frameworks (Jest, React Testing Library)',
        'Experience with version control systems (Git)',
        "Bachelor's degree in Computer Science or equivalent experience",
      ],
      niceToHave: [
        'Experience with Node.js and full-stack development',
        'Knowledge of cloud platforms (AWS, Azure, GCP)',
        'Familiarity with GraphQL and REST APIs',
        'Experience with CI/CD pipelines',
        'Contributions to open-source projects',
      ],
      benefits: [
        'Competitive salary and equity package',
        'Health, dental, and vision insurance',
        'Flexible working hours and remote work options',
        'Professional development budget ($3,000/year)',
        'Unlimited PTO policy',
        'Modern office with free meals and snacks',
        'Gym membership reimbursement',
      ],
      companyDescription:
        "TechCorp Solutions is a leading technology company that builds innovative software solutions for businesses worldwide. Founded in 2015, we've grown to over 500 employees across multiple offices and are backed by top-tier investors. Our mission is to democratize technology and make powerful tools accessible to everyone.",
      stats: {
        employees: '500+',
        users: '50M+',
        countries: '15+',
      },
    },
    {
      id: 5,
      title: 'Digital Marketing Manager',
      company: 'Creative Media Inc',
      logo: 'CM',
      location: '🌍 New York, NY (Hybrid)',
      type: '💼 Full-time',
      salary: '💰 $85,000 - $110,000',
      postedDate: '📅 Posted 1 week ago',
      tags: [
        'SEO/SEM',
        'Google Ads',
        'Analytics',
        'Social Media',
        'Content Strategy',
      ],
      theme: 'marketing',
      about:
        "Join our dynamic marketing team as a Digital Marketing Manager! You'll lead comprehensive digital marketing campaigns, drive brand awareness, and optimize our online presence across multiple channels. This role is perfect for a strategic thinker who loves data-driven marketing and creative problem-solving.",
      responsibilities: [
        'Develop and execute comprehensive digital marketing strategies',
        'Manage SEO/SEM campaigns and optimize for ROI',
        'Create and manage social media content calendars',
        'Analyze campaign performance and provide actionable insights',
        'Collaborate with creative team on marketing materials',
        'Lead email marketing campaigns and automation workflows',
      ],
      requirements: [
        '4+ years of digital marketing experience',
        'Proven track record with Google Ads and Facebook Ads',
        'Strong analytical skills with Google Analytics',
        'Experience with marketing automation platforms',
        'Excellent written and verbal communication skills',
        "Bachelor's degree in Marketing, Communications, or related field",
      ],
      niceToHave: [
        'Experience with HubSpot or Salesforce',
        'Knowledge of HTML/CSS basics',
        'Certifications in Google Ads or Facebook Blueprint',
        'Experience with A/B testing platforms',
        'Background in B2B marketing',
      ],
      benefits: [
        'Competitive salary with performance bonuses',
        'Comprehensive health and wellness package',
        'Flexible work arrangements',
        'Marketing conference and training budget',
        '4 weeks paid vacation',
        'Creative workspace in downtown NYC',
        'Team building events and company retreats',
      ],
      companyDescription:
        'Creative Media Inc is an award-winning digital agency that helps brands tell their stories through innovative marketing campaigns. With offices in New York and Los Angeles, we work with Fortune 500 companies and emerging startups to create memorable brand experiences.',
      stats: {
        employees: '200+',
        users: '10M+',
        countries: '8+',
      },
    },
    {
      id: 6,
      title: 'Registered Nurse - ICU',
      company: 'Metro Health Systems',
      logo: 'MH',
      location: '🌍 Chicago, IL (On-site)',
      type: '💼 Full-time / Part-time',
      salary: '💰 $75,000 - $95,000',
      postedDate: '📅 Posted 3 days ago',
      tags: [
        'Critical Care',
        'BSN Required',
        'ACLS Certified',
        'Night Shift',
        'Sign-on Bonus',
      ],
      theme: 'healthcare',
      about:
        "Join our dedicated ICU team at Metro Health Systems! We're looking for a compassionate and skilled Registered Nurse to provide exceptional critical care to our patients. You'll work with state-of-the-art equipment and collaborate with a multidisciplinary team committed to saving lives.",
      responsibilities: [
        'Provide direct patient care in intensive care unit',
        'Monitor and assess critically ill patients',
        'Administer medications and treatments as prescribed',
        'Collaborate with physicians and healthcare team',
        'Educate patients and families about care plans',
        'Maintain accurate patient documentation and records',
      ],
      requirements: [
        'Current RN license in Illinois',
        'BSN degree from accredited nursing program',
        'ACLS and BLS certification required',
        '2+ years of ICU or critical care experience preferred',
        'Strong critical thinking and assessment skills',
        'Excellent communication and interpersonal skills',
      ],
      niceToHave: [
        'CCRN certification',
        'Experience with Epic EMR system',
        'Bilingual English/Spanish',
        'Previous trauma experience',
        'Leadership or charge nurse experience',
      ],
      benefits: [
        'Competitive salary with shift differentials',
        'Comprehensive medical, dental, and vision coverage',
        '$10,000 sign-on bonus for qualified candidates',
        'Tuition reimbursement program',
        'Retirement plan with employer matching',
        'Generous PTO and holiday pay',
        'Professional development opportunities',
      ],
      companyDescription:
        'Metro Health Systems is a leading healthcare provider in the Chicago metropolitan area, serving our community for over 50 years. We operate multiple hospitals and clinics, providing comprehensive medical services with a focus on patient-centered care and clinical excellence.',
      stats: {
        employees: '2,500+',
        users: '500K+',
        countries: '1',
      },
    },
  ];

  get selectedJob(): GetAllJobPostsDto | undefined {
    if (!this.jobPostData || this.jobPostData.length === 0) {
      return undefined;
    }

    return (
      this.jobPostData.find((job) => job.jobPostingId === this.selectedJobId) ||
      this.jobPostData[0]
    );
  }

  selectedJobId: string | null = null; // Change from number to string

  selectJob(jobId: string): void {
    this.selectedJobId = jobId;
  }
  getLogoColor(theme: string): string {
    switch (theme) {
      case 'tech':
        return '#3B82F6';
      case 'marketing':
        return '#EF4444';
      case 'healthcare':
        return '#059669';
      default:
        return '#3B82F6';
    }
  }

  // getBorderColor(theme: string): string {
  //   switch (theme) {
  //     case 'tech':
  //       return '#3B82F6';
  //     case 'marketing':
  //       return '#EF4444';
  //     case 'healthcare':
  //       return '#059669';
  //     default:
  //       return '#3B82F6';
  //   }
  // }
}
