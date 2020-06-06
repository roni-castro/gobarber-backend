import IStorageProvider from '../models/IStorageProvider';

export default class FakeDiskStorageProvider implements IStorageProvider {
  private files: string[] = [];
  async saveFile(file: string): Promise<string> {
    this.files.push(file);
    return file;
  }
  async deleteFile(fileToDelete: string): Promise<void> {
    this.files.filter(file => file !== fileToDelete);
  }
}
