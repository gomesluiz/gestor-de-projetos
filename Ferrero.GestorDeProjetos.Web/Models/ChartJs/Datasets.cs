namespace Ferrero.GestorDeProjetos.Web.Models.ChartJs
{
    public class Datasets
    {
        public string label { get; set; }
        public string[] backgroundColor { get; set; }
        public string[] borderColor { get; set; }

        public string borderWidth { get; set; }
        public int[] data { get; set; }
        public string fill { get; set; }
    }
}