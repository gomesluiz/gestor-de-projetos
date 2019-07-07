using System;

namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de lançamento financeiro.
    /// </summary>
    public class ResumoFinanceiro
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public decimal Commitment { get; set; }
        public decimal Assigned { get; set; }
        public decimal Actual { get; set; }
        public decimal Available { get; set; }
        public OrdemDeInvestimento OrdemDeInvestimento { get; set; }
    }
}