const HTTPStatus = Object.freeze(
    {
        SUCCESS:                                    {code:200, message:"Successfully."},
        RECORD_CREATED_SUCCESSFULLY:                {code:201, message:"Record created successfully."}, 
        RECORD_DELETED_SUCCESSFULLY:                {code:200, message:"Record deleted successfully."},
        RECORD_UPDATED_SUCCESSFULLY:                {code:200, message:"Record updated successfully."},
        DATABASE_RETURNED_AN_EMPTY_ARRAY:           {code:200, message:"Database returned an empty dataset."}, 
        MANDATORY_FIELDS_NOT_PROVIDED:              {code:400, message:"Field %s is required."},
        EMPTY_MANDATORY_FIELDS:                     {code:400, message:"Field %s cannot be empty."},
        INVALID_MANDATORY_FIELDS:                   {code:400, message:"Field %s is invalid."},
        UNAUTHENTICATED_CLIENT:                     {code:403, message:"Unauthenticated client"},
        DATABASE_RECORD_NOT_FOUND:                  {code:404, message:"Database did not find the record."},
        INTERNAL_SERVER_ERROR:                      {code:500, message:"Internal Server Error"},
    }
);

module.exports = HTTPStatus