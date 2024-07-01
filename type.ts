export interface ShopData {
    ShopName: string;
    ShopLocation?: string;
    Logo?: string;
    Colour?: string;
    url_identifier: string;
  }
  


export interface ShopDataP {
    ShopName: string;
    ShopLocation: string;
    Logo: string;
    Colour: string;
    url_identifier: string;
}



export interface ShopData {
  shopename: string;
  shopelogo: string;
  shopcode: string;
  shopplace: string;
  currentpoints: number;
  username: string;
}

export interface MyRewardsData {
  username: string;
  shops: ShopData[];
}

export type MenuItem = {
  title: string;
  description: string;
  img: string;
  price: number;
};

export type Menu = {
  heading: string;
  items: MenuItem[];
};

export type MenuApi = {
  menu_data: Menu[];
  status: string;
  color: string;
};

export type Author = {
  name: string;
  picture: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  HWArray?: number[][];
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
  customData: number[][];
};

export type ReferralShopData = {
  usercode: number;
  clientcode: string;
  shopname: string;
  shopplace: string;
  shopelogo: string;
  reward: {
    reward: string;
    no_of_referral: string;
  }[];
  refer_arrival_text?: string; // enne oral reffer cheythal kitunna prize nte text
  refer_arrival_prize?: string; // enne oral reffer cheythal kitunna prize
  feedback_prize: string | null; // feedback kodtha prize
  feedbackprize_title: string | null; // feedback kodtha prize title
  username: string;
  currentpoints: number;
  shopdata: {
    average_rating: number;
    feedback_details: {
      feedback_msg: string;
      feedback_user: string;
    }[];
  };
  website_link: string | null;
  instagram_link: string | null;
  shop_phone: number | null;
};

export type UserData = {
  profileDetails: {
    username: string;
    userphone: number;
    useremail: string | null;
    birthday: string;
    whatsapp_notification: boolean;
    email_notification: boolean;
    whatsapp_offers: boolean;
  };
  shopDetails: {
    shopname: string;
    shopplace: string;
    shopphone: number;
    shopinsta: string;
    shopmap: string;
  };
};

export type LoyaltyProgram = {
  loyalpageDetails: {
    username: string;
    loyaltypoints: number;
    points_per_amount: number;
    amount_spent: number;
    rewards: {
      reward: string;
      points_needed: number;
    }[];
    t_and_c: string[];
    loyalqr_text: string;
    loyaltystatus: boolean;
  };
  shopDetails: {
    shopname: string;
    shopplace: string;
    shopphone: number;
    shopinsta: string;
    shopmap: string;
    shopcolor: string;
    shoplogo: string;
  };
};

export type PrizeData = {
  prizeData: {
    username: string;
    referral_prize: {
      reward: string;
      no_of_referral: string;
    }[];
    referral_points: number;
    refer_person: string;
    userid: string;
    refer_person_phone: number;
    arrival_status: boolean;
    referral_status: boolean;
    loyalty_status: boolean;
    loyalty_points: number;
    shopcolor: string;
  };
  offers: {
    reward: string;
    reward_description: string;
    t_and_c: string[];
  }[];
};
