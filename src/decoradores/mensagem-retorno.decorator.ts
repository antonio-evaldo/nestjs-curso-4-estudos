import { SetMetadata } from '@nestjs/common';

export const MensagemRetorno = (mensagem: string) => {
  return SetMetadata('mensagem_retorno', mensagem);
};
