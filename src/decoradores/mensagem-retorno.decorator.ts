import { SetMetadata } from '@nestjs/common';

export const CHAVE_MENSAGEM_RETORNO = 'mensagem_retorno';

export const MensagemRetorno = (mensagem: string) => {
  return SetMetadata(CHAVE_MENSAGEM_RETORNO, mensagem);
};
