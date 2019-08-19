namespace Ferrero.GestorDeProjetos.Web.Models.Helpers
{
    public class UploadDownloadResponse 
    {
      public const  string STATUS_OK = "Ok";
      public const string STATUS_NOK = "Nok";

      public string Status { get; }

      public bool IsOk()
      {
        return Status == STATUS_OK;
      }

      public string Message { get; }
      public string FileName { get;  }

      public UploadDownloadResponse(string status, string message="", string fileName="")
      {
        Status = status;
        Message = message;
        FileName =  fileName;
      }

    }
}