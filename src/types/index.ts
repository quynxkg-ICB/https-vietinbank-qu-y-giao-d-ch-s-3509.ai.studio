export interface Consultant {
  name: string;
  title: string;
  phone: string;
  phoneRaw: string;
}

export interface BankInfo {
  name: string;
  fullName: string;
  branchName: string;
  slogan: string;
  logo: string;
  consultant: Consultant;
  hotline: string;
  thanksExitMessage: string;
}

export interface NavItem {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  description: string;
}

export interface FaqStep {
  step: number;
  title: string;
  desc: string;
  image: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  shortDesc: string;
  videoUrl?: string;
  steps: FaqStep[];
}

export interface FaqData {
  questionPrompt: string;
  feedbackFeedbackUnresolved: string;
  topics: FaqTopic[];
}

export interface DownloadPlatform {
  platform: string;
  url: string;
  storeName: string;
  badge: string;
  qrLabel: string;
}

export interface DownloadIpayData {
  title: string;
  subtitle: string;
  ios: DownloadPlatform;
  android: DownloadPlatform;
  features: string[];
}

export interface TermOption {
  months: number;
  label: string;
  suggestedRate: number;
}

export interface DepositInterestData {
  title: string;
  subtitle: string;
  minAmount: number;
  videoGuideUrl: string;
  termOptions: TermOption[];
  defaultAmount: number;
  defaultTerm: number;
  defaultRate: number;
  rules: {
    amountError: string;
    termError: string;
    rateError: string;
  };
}

export interface FrequencyOption {
  id: string;
  label: string;
  divisor: number;
  intervalMonths: number;
}

export interface LoanScheduleData {
  title: string;
  subtitle: string;
  defaultCollateralValue: number;
  defaultLoanAmount: number;
  defaultMonths: number;
  defaultInterestRate: number;
  frequencyOptions: FrequencyOption[];
}

export interface ProductItem {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  badge: string;
  desc: string;
  image: string;
}

export interface CategoryOption {
  id: string;
  label: string;
}

export interface FeaturedProductsData {
  title: string;
  subtitle: string;
  categories: CategoryOption[];
  items: ProductItem[];
  interestResponseModal: {
    title: string;
    message: string;
    contactNote: string;
  };
}

export interface BranchItem {
  stt: number;
  name: string;
  unit: string;
  address: string;
  googleMapsUrl: string;
  workingHours: string;
  image: string;
  phone: string;
  phoneRaw: string;
}

export interface BranchData {
  title: string;
  subtitle: string;
  workingHoursDefault: string;
  branches: BranchItem[];
}

export interface FlappyConfig {
  title: string;
  shortDesc: string;
  brandName: string;
  voucherText: string;
  winScore: number;
  gravity: number;
  jumpForce: number;
  pipeSpeed: number;
  pipeGap: number;
  encouragements: Record<string, string>;
  winNote: string;
  loseMessage: string;
}

export interface SnakeRewardThreshold {
  score: number;
  reward: string;
  message: string;
}

export interface SnakeConfig {
  title: string;
  subTitle: string;
  thresholds: SnakeRewardThreshold[];
  loseMessage: string;
  confirmNote: string;
}

export interface GamesConfig {
  flappy: FlappyConfig;
  snake: SnakeConfig;
}

export interface ContentData {
  bankInfo: BankInfo;
  navigation: NavItem[];
  faqData: FaqData;
  downloadIpayData: DownloadIpayData;
  depositInterestData: DepositInterestData;
  loanScheduleData: LoanScheduleData;
  featuredProductsData: FeaturedProductsData;
  branchData: BranchData;
  gamesConfig: GamesConfig;
}

export interface ScheduleRow {
  period: number;
  paymentDate: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}
