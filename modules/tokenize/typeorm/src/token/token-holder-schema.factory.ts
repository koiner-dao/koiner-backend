import { UUID } from '@appvise/domain';
import {
  EntityProps,
  EntitySchemaFactory,
  EntitySchemaProps,
} from '@appvise/typeorm';
import { KoinosAddressId } from '@koiner/domain';
import { TokenHolder, TokenHolderProps } from '@koiner/tokenize/domain';
import { TokenHolderSchema } from '.';

export class TokenHolderSchemaFactory extends EntitySchemaFactory<
  TokenHolder,
  TokenHolderSchema
> {
  protected toDomainProps(
    entitySchema: TokenHolderSchema
  ): EntityProps<TokenHolderProps> {
    const id = new UUID(entitySchema.id);

    const props: TokenHolderProps = {
      addressId: new KoinosAddressId(entitySchema.address_id),
      contractId: new KoinosAddressId(entitySchema.contract_id),
      balance: parseInt(entitySchema.balance),
    };

    return { id, props };
  }

  protected toSchemaProps(
    entity: TokenHolder
  ): EntitySchemaProps<TokenHolderSchema> {
    const props = entity.getPropsCopy();

    return {
      address_id: props.addressId.value,
      contract_id: props.contractId.value,
      balance: String(props.balance).padStart(20, '0'),
    };
  }
}