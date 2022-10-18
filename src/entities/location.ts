import { Prop } from '@nestjs/mongoose';
import { Audit } from './audit';

export class Location extends Audit {
  @Prop()
  latitude: string;

  @Prop()
  longitude: string;

  @Prop()
  city: string;

  @Prop()
  province: string;

  @Prop()
  country: string;
}
