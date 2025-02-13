import multer from 'multer';

// Configuração do armazenamento no servidor (pode ser alterado para S3, por exemplo)
const storage = multer.memoryStorage(); // Alternativamente, use diskStorage para salvar localmente

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens e PDFs são permitidos!'));
    }
  },
});

export default upload;