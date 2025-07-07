import { useEffect, useCallback } from 'react';
import { FormInstance } from 'antd/lib/form';
import { useDebouncedCallback } from 'use-debounce';
import { formPersistenceService } from '@/services/formPersistenceService';
import { FormType } from '@/types/IndexedDB';
import { usePathname } from 'next/navigation';

interface UseOfflineFormOptions {
  form: FormInstance;
  formId: string;
  formType: FormType;
}

export function useOfflineForm({ form, formId, formType }: UseOfflineFormOptions) {
  const pathname = usePathname();

  // Debounced save function to avoid writing to IndexedDB on every keystroke
  const debouncedSave = useDebouncedCallback(
    (values: Record<string, any>) => {
      formPersistenceService.saveForm(formId, formType, pathname, values);
    },
    500 // Save 500ms after the user stops typing
  );

  // Effect to load saved form data when the component mounts
  useEffect(() => {
    const loadData = async () => {
      const savedData = await formPersistenceService.getForm(formId);
      if (savedData) {
        console.log(`Restoring form data for ${formId}`, savedData);
        form.setFieldsValue(savedData);
      }
    };
    loadData();
  }, [form, formId]);

  // Function to handle form value changes
  const onValuesChange = useCallback(
    (_: Record<string, any>, allValues: Record<string, any>) => {
      debouncedSave(allValues);
    },
    [debouncedSave]
  );

  // Function to clean up the saved form data after successful submission
  const cleanupSavedForm = useCallback(async () => {
    await formPersistenceService.deleteForm(formId);
    console.log(`Cleaned up saved form data for ${formId}`);
  }, [formId]);

  return { onValuesChange, cleanupSavedForm };
} 