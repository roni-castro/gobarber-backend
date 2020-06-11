export default interface IEmailProvider {
  sendEmail(to: string, body: string): Promise<void>;
}
