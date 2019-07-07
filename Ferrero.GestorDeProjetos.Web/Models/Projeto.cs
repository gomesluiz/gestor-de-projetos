using System;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um projeto.
    /// </summary>
    public class Projeto {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public DateTime DataDeInicio { get; set; }  
        public DateTime DataDeTermino { get; set; }
        public OrdemDeInvestimento OrdemDeInvestimento { get; set; }
        public bool Concluido { get; set; }
    }
}