import nodemailer from 'nodemailer';
import { env } from './env.config';
import { logger } from '../common/utils/logger';

let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      secure: env.email.secure,
      auth: {
        user: env.email.user,
        pass: env.email.pass,
      },
    });

    // Verify connection in non-test environments
    if (!env.node.isTest && env.email.user) {
      transporter.verify((error) => {
        if (error) {
          logger.error('Email transporter verification failed:', error);
        } else {
          logger.info('Email transporter ready');
        }
      });
    }
  }
  return transporter;
}

export const emailConfig = {
  from: env.email.from,
};
