export interface Conference {
  senderEmail: string;
  groupId: string;
  groupName: string;
  isStartCall: boolean;
  offer?: Offer;
}

interface Offer {
  sdp: string;
  type: string;
}
