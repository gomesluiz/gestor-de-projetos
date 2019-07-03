using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
    public class Intervalo {
        public DateTime DataDeInicio { get; set; }    
        public DateTime DataDeTermino { get; set; }
    }
}