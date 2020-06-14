interface ITemplateVariablesDTO {
  [key: string]: string | number;
}

export default class IParseEmailTemplateDTO {
  file: string;
  variables: ITemplateVariablesDTO;
}
