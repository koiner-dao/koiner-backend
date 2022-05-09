import {
  EntityProps,
  EntitySchemaFactory,
  EntitySchemaProps,
} from '@appvise/typeorm';
import { Address, AddressProps } from '@koiner/chain/domain';
import { AddressSchema } from './address.schema';
import { KoinosAddressId } from '@koiner/domain';

export class AddressSchemaFactory extends EntitySchemaFactory<
  Address,
  AddressSchema
> {
  protected toDomainProps(
    entitySchema: AddressSchema,
  ): EntityProps<AddressProps> {
    const id = new KoinosAddressId(entitySchema.id);

    const props: AddressProps = {
      isProducer: entitySchema.is_producer,
    };

    return { id, props };
  }

  protected toSchemaProps(entity: Address): EntitySchemaProps<AddressSchema> {
    const props = entity.getPropsCopy();

    return {
      is_producer: props.isProducer,
    };
  }
}