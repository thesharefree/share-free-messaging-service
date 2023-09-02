export interface Conference {
  senderEmail: string;
  groupId: string;
  groupName: string;
  isStartCall: boolean;
  offer?: RTCSessionDescription;
  answer?: RTCSessionDescription;
  iceCandidate?: IceCandidate;
}

interface RTCSessionDescription {
  sdp: string;
  type: string;
}

interface IceCandidate {
  id: string;
  label: string;
  candidate: string;
}
