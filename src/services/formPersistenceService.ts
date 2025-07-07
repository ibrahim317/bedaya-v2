import { indexedDBService } from './indexedDBService';
import { STORE_NAMES, CachedForm, FormType } from '@/types/IndexedDB';
import { v4 as uuidv4 } from 'uuid';

class FormPersistenceService {
  /**
   * Saves the current state of a form to IndexedDB.
   * @param formId - A unique identifier for the form instance.
   * @param formType - The type of form being saved (e.g., PATIENT_CREATE).
   * @param route - The current URL route of the form.
   * @param data - The form data to save.
   * @param userId - Optional ID of the current user.
   */
  async saveForm(
    formId: string,
    formType: FormType,
    route: string,
    data: Record<string, any>,
    userId?: string
  ): Promise<void> {
    try {
      const formToSave: CachedForm = {
        id: formId,
        type: formType,
        route,
        data,
        timestamp: new Date(),
        isComplete: false, // This would be marked true on successful submission
        userId,
      };
      await indexedDBService.saveForm(formToSave);
    } catch (error) {
      console.error(`Failed to save form ${formId}:`, error);
    }
  }

  /**
   * Retrieves the saved state of a form from IndexedDB.
   * @param formId - The unique identifier for the form instance.
   * @returns The cached form data, or null if not found.
   */
  async getForm(formId: string): Promise<Record<string, any> | null> {
    try {
      const cachedForm = await indexedDBService.getForm(formId);
      return cachedForm ? cachedForm.data : null;
    } catch (error) {
      console.error(`Failed to retrieve form ${formId}:`, error);
      return null;
    }
  }

  /**
   * Deletes a saved form state from IndexedDB.
   * Typically called after a successful form submission.
   * @param formId - The unique identifier for the form instance.
   */
  async deleteForm(formId: string): Promise<void> {
    try {
      await indexedDBService.delete(STORE_NAMES.FORMS, formId);
    } catch (error) {
      console.error(`Failed to delete form ${formId}:`, error);
    }
  }

  /**
   * Retrieves all saved forms, e.g., for a summary view of pending drafts.
   * @returns An array of all cached forms.
   */
  async getAllForms(): Promise<CachedForm[]> {
    try {
      return await indexedDBService.getAllForms();
    } catch (error) {
      console.error('Failed to retrieve all forms:', error);
      return [];
    }
  }

  /**
   * Generates a unique ID for a new form session.
   */
  generateFormId(): string {
    return uuidv4();
  }
}

export const formPersistenceService = new FormPersistenceService(); 