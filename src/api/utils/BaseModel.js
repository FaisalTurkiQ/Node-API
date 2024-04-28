// Usage: Extend the base schema in your model files to include common fields.

const options = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  };
  
  /**
   * Creates a base schema for MongoDB models.
   * Automatically includes `createdBy` and `updatedBy` fields linked to the specified model.
   *
   * @param {string} refModel - The model's name for `createdBy` and `updatedBy` references.
   * @returns {mongoose.Schema} Configured base schema.
   * Example on how to extend this base schema in other models:
   * const userSchema = createBaseSchema('User');
   * userSchema.add({
   *   username: String,
   *   email: String
   * });
   * const User = mongoose.model('User', userSchema);
   * 
   * This method allows any new model to inherit common fields (createdBy, updatedBy)
   * and behaviors (timestamps, JSON transformation) defined here.
   */
  const createBaseSchema = (refModel) => {
      const baseSchema = new mongoose.Schema({
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: refModel, 
          required: true
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: refModel,
          required: true
        }
      }, options);
  
      // Transform for JSON serialization
      baseSchema.set('toJSON', {
        virtuals: true,
        transform: function (doc, ret) {
          delete ret.__v;  
        }
      });
  
      return baseSchema;
  };
  
  module.exports = createBaseSchema;
  