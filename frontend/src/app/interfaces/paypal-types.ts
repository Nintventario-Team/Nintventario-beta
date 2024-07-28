export interface Link {
    href: string;
    rel: string;
    method: string;
  }
  
  export interface PayPalOrder {
    id: string;
    status: string;
    links: Link[];
  }
  
  export interface PayPalCaptureResponse {
    id: string;
    status: string;
    purchase_units: PurchaseUnit[];
    details?: ErrorDetail[];
    debug_id?: string;
  }
  
  export interface PurchaseUnit {
    payments: Payments;
  }
  
  export interface Payments {
    captures?: Capture[];
    authorizations?: Authorization[];
  }
  
  export interface Capture {
    id: string;
    status: string;
  }
  
  export interface Authorization {
    id: string;
    status: string;
  }
  
  export interface ErrorDetail {
    issue: string;
    description: string;
  }