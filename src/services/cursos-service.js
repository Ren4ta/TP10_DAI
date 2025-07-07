import { CursosRepository } from '../repositories/cursos-repository.js';

export const CursosService = {
    getAll: async () => await CursosRepository.getAllAsync(),
    
};
