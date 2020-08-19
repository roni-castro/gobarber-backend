interface IEmailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver: process.env.EMAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: 'GoBarberApp',
      email: 'gobarber@roni.app',
    },
  },
} as IEmailConfig;
