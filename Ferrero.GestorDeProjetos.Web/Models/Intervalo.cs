using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
    public class Intervalo {
        public DateTime DataDeInicio { get; set; }    
        public DateTime DataDeTermino { get; set; }

        public long Diferenca(){
            return  Convert.ToInt64( (DataDeTermino - DataDeInicio).TotalDays );
        }
        
        public void Arredonda(int n){
            long resto = this.Diferenca() % n;
            DataDeTermino.AddDays(resto + 1);
        }
    }
}