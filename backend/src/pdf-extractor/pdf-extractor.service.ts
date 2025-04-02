import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import { DataTranformService } from './data-transform.service';
import { InvoiceService } from '../customer/invoice.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PdfExtractorService implements OnModuleInit {
  private readonly logger = new Logger(PdfExtractorService.name);
  private readonly directoryPath: string;

  constructor(
    private readonly dataTranformeService: DataTranformService,
    private readonly invoiceService: InvoiceService,
    private readonly configService: ConfigService) {
      this.directoryPath = this.configService.get<string>('PATH_FILES', './invoices');
      // Garantir que o diretório existe
      fs.ensureDirSync(this.directoryPath);
  }

  async onModuleInit() {
    this.logger.log('🔍 Iniciando processamento batch de PDFs...');
    await this.executeInitialProcess();
  }

  /**
   * Busca arquivos PDF em diretórios recursivamente
   */
  async findPdfFiles(dir = this.directoryPath, fileList: string[] = []): Promise<string[]> {
    try {
      const files = await fs.readdir(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          // Se for um diretório, chama a função recursivamente
          await this.findPdfFiles(fullPath, fileList);
        } else if (file.endsWith('.pdf')) {
          // Adiciona o caminho do arquivo PDF encontrado
          fileList.push(fullPath);
        }
      }
      
      return fileList;
    } catch (error) {
      this.logger.error(`Erro ao ler diretório: ${dir}`, error);
      return [];
    }
  }

  /**
   * Lista todos os arquivos PDF no diretório
   */
  async listPdfFiles(): Promise<string[]> {
    try {
      const files = await this.findPdfFiles(this.directoryPath);
      return files.filter(file => file.endsWith('.pdf'));
    } catch (error) {
      this.logger.error('Erro ao listar arquivos PDF:', error);
      return [];
    }
  }

  /**
   * Extrai texto de um arquivo PDF
   */
  async extractTextFromPdf(filePath: string): Promise<string> {
    try {
      const pdfBuffer = await fs.readFile(filePath);
      const data = await pdfParse(pdfBuffer);
      return data.text;
    } catch (error) {
      this.logger.error(`Erro ao extrair texto de ${filePath}:`, error);
      return '';
    }
  }

  private async executeInitialProcess() {
    const pdfFiles = await this.listPdfFiles();
    if (pdfFiles.length === 0) {
      this.logger.log('📂 Nenhum arquivo PDF encontrado.');
      return;
    }

    for (const file of pdfFiles) {
      const filePath = path.join(process.cwd(), file);
      const fileName = path.basename(file);
      
      const text = await this.extractTextFromPdf(filePath);
      this.logger.log(`📄 PDF: ${file}`);
      
      const dataFile = {
        ...this.dataTranformeService.extractData(text),
        fileName: fileName
      }

      this.invoiceService.saveInvoice(dataFile);
    }

    this.logger.log('✅ Processamento batch concluído.');
  }

}
