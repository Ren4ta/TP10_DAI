import { AlumnosRepository } from '../repositories/alumnos-repository.js';

export const AlumnosService = {
    getAll: async () => await AlumnosRepository.getAllAsync(),
    getById: async (id) => await AlumnosRepository.getByIdAsync(id),
    create: async (data) => {
        if (!data.nombre || data.nombre.length < 3) throw new Error("El nombre debe tener al menos 3 letras");
        return await AlumnosRepository.createAsync(data);
    },
    update: async (data) => {
        if (!data.id) throw new Error("Falta el ID");
        if (!data.nombre || data.nombre.length < 3) throw new Error("El nombre debe tener al menos 3 letras");
        return await AlumnosRepository.updateAsync(data);
    },
    delete: async (id) => await AlumnosRepository.deleteAsync(id)
};
