import supabase from '../configs/supabaseClient.js';
import { LogHelper } from '../helpers/log-helper.js';

export const CursosRepository = {
    getAllAsync: async () => {
        try {
            const { data, error } = await supabase.from('cursos').select('*');
            if (error) LogHelper.logError(error);
            return data ?? [];
        } catch (error) {
            LogHelper.logError(error);
            return [];
        }
    },
    
};
