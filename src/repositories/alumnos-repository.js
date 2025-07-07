import supabase from '../configs/supabaseClient.js';
import { LogHelper } from '../helpers/log-helper.js';

export const AlumnosRepository = {
    getAllAsync: async () => {
        try {
            const { data, error } = await supabase.from('alumnos').select('*');
            if (error) LogHelper.logError(error);
            return data ?? [];
        } catch (error) {
            LogHelper.logError(error);
            return [];
        }
    },
    getByIdAsync: async (id) => {
        try {
            const { data, error } = await supabase.from('alumnos').select('*').eq('id', id).single();
            if (error) LogHelper.logError(error);
            return data;
        } catch (error) {
            LogHelper.logError(error);
            return null;
        }
    },
    createAsync: async (alumno) => {
        try {
            const { error } = await supabase.from('alumnos').insert([alumno]);
            if (error) LogHelper.logError(error);
            return !error;
        } catch (error) {
            LogHelper.logError(error);
            return false;
        }
    },
    updateAsync: async (alumno) => {
        try {
            const { id, ...rest } = alumno;
            const { error } = await supabase.from('alumnos').update(rest).eq('id', id);
            if (error) LogHelper.logError(error);
            return !error;
        } catch (error) {
            LogHelper.logError(error);
            return false;
        }
    },
    deleteAsync: async (id) => {
        try {
            const { error } = await supabase.from('alumnos').delete().eq('id', id);
            if (error) LogHelper.logError(error);
            return !error;
        } catch (error) {
            LogHelper.logError(error);
            return false;
        }
    }
};
