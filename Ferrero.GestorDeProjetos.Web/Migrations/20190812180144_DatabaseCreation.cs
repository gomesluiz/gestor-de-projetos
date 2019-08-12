using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Ferrero.GestorDeProjetos.Web.Migrations
{
    public partial class DatabaseCreation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Atividades",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Text = table.Column<string>(nullable: true),
                    StartDate = table.Column<DateTime>(nullable: false),
                    Duration = table.Column<int>(nullable: false),
                    Progress = table.Column<decimal>(nullable: false),
                    ParentId = table.Column<int>(nullable: true),
                    Type = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Atividades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CentrosDeCusto",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Nome = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CentrosDeCusto", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fornecedores",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fornecedores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrdensDeInvestimento",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Numero = table.Column<string>(maxLength: 7, nullable: false),
                    Budget = table.Column<decimal>(type: "DECIMAL(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdensDeInvestimento", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Login = table.Column<string>(maxLength: 25, nullable: false),
                    Nome = table.Column<string>(maxLength: 50, nullable: false),
                    Email = table.Column<string>(maxLength: 50, nullable: false),
                    Senha = table.Column<string>(maxLength: 128, nullable: false),
                    IsAdmin = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vinculos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Type = table.Column<string>(nullable: true),
                    SourceTaskId = table.Column<int>(nullable: false),
                    TargetTaskId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vinculos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ativos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Numero = table.Column<string>(maxLength: 10, nullable: true),
                    Descricao = table.Column<string>(maxLength: 50, nullable: true),
                    OrdemDeInvestimentoId = table.Column<int>(nullable: true),
                    CentroDeCustoId = table.Column<int>(nullable: true),
                    Planta = table.Column<string>(maxLength: 50, nullable: true),
                    Quantidade = table.Column<int>(nullable: false, defaultValue: 1),
                    Divisao = table.Column<int>(nullable: false, defaultValue: 1),
                    Natureza = table.Column<int>(nullable: false),
                    Propriedade = table.Column<int>(nullable: false, defaultValue: 1),
                    UsoNoAdministrativo = table.Column<bool>(nullable: false, defaultValue: false),
                    UsoNoProcessoFabril = table.Column<bool>(nullable: false, defaultValue: false),
                    ProntoParaUso = table.Column<bool>(nullable: false, defaultValue: false),
                    MaquinaEmMontagemInstalacao = table.Column<bool>(nullable: false, defaultValue: false),
                    EdificacaoEmAndamento = table.Column<bool>(nullable: false, defaultValue: false),
                    Observacoes = table.Column<string>(maxLength: 250, nullable: true),
                    Requisitante = table.Column<string>(maxLength: 50, nullable: true),
                    SituacaoDoAtivo = table.Column<int>(nullable: false, defaultValue: 1)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ativos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ativos_CentrosDeCusto_CentroDeCustoId",
                        column: x => x.CentroDeCustoId,
                        principalTable: "CentrosDeCusto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ativos_OrdensDeInvestimento_OrdemDeInvestimentoId",
                        column: x => x.OrdemDeInvestimentoId,
                        principalTable: "OrdensDeInvestimento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Projetos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(maxLength: 50, nullable: false),
                    Descricao = table.Column<string>(maxLength: 250, nullable: true),
                    DataDeInicio = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    DataDeTermino = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    OrdemDeInvestimentoId = table.Column<int>(nullable: true),
                    Concluido = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projetos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projetos_OrdensDeInvestimento_OrdemDeInvestimentoId",
                        column: x => x.OrdemDeInvestimentoId,
                        principalTable: "OrdensDeInvestimento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ResumosFinanceiros",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Data = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    Commitment = table.Column<decimal>(type: "DECIMAL(10,2)", nullable: false),
                    Assigned = table.Column<decimal>(type: "DECIMAL(10,2)", nullable: false),
                    Actual = table.Column<decimal>(type: "DECIMAL(10,2)", nullable: false),
                    Available = table.Column<decimal>(type: "DECIMAL(10,2)", nullable: false),
                    OrdemDeInvestimentoId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResumosFinanceiros", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResumosFinanceiros_OrdensDeInvestimento_OrdemDeInvestimentoId",
                        column: x => x.OrdemDeInvestimentoId,
                        principalTable: "OrdensDeInvestimento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RequisicoesDeCompra",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Numero = table.Column<long>(nullable: false),
                    Data = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    NumeroDaOrdemDeCompra = table.Column<long>(nullable: true),
                    Descricao = table.Column<string>(maxLength: 250, nullable: true),
                    AtivoId = table.Column<int>(nullable: true),
                    Proposta = table.Column<string>(maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequisicoesDeCompra", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RequisicoesDeCompra_Ativos_AtivoId",
                        column: x => x.AtivoId,
                        principalTable: "Ativos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Documentos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Titulo = table.Column<string>(maxLength: 50, nullable: false),
                    Descricao = table.Column<string>(maxLength: 250, nullable: true),
                    Versao = table.Column<string>(maxLength: 10, nullable: false),
                    Arquivo = table.Column<string>(maxLength: 500, nullable: false),
                    ProjetoId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Documentos_Projetos_ProjetoId",
                        column: x => x.ProjetoId,
                        principalTable: "Projetos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Titulo = table.Column<string>(maxLength: 50, nullable: false),
                    Descricao = table.Column<string>(maxLength: 250, nullable: true),
                    ListaId = table.Column<int>(nullable: false),
                    ProjetoId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarefas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tarefas_Projetos_ProjetoId",
                        column: x => x.ProjetoId,
                        principalTable: "Projetos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NotasFiscais",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Numero = table.Column<int>(nullable: false),
                    DataDeLancamento = table.Column<DateTime>(type: "DATETIME", nullable: false),
                    FornecedorId = table.Column<int>(nullable: true),
                    RequisicaoDeCompraId = table.Column<int>(nullable: true),
                    Migo = table.Column<long>(nullable: false),
                    Valor = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotasFiscais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotasFiscais_Fornecedores_FornecedorId",
                        column: x => x.FornecedorId,
                        principalTable: "Fornecedores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NotasFiscais_RequisicoesDeCompra_RequisicaoDeCompraId",
                        column: x => x.RequisicaoDeCompraId,
                        principalTable: "RequisicoesDeCompra",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ativos_CentroDeCustoId",
                table: "Ativos",
                column: "CentroDeCustoId");

            migrationBuilder.CreateIndex(
                name: "IX_Ativos_OrdemDeInvestimentoId",
                table: "Ativos",
                column: "OrdemDeInvestimentoId");

            migrationBuilder.CreateIndex(
                name: "IX_Documentos_ProjetoId",
                table: "Documentos",
                column: "ProjetoId");

            migrationBuilder.CreateIndex(
                name: "IX_NotasFiscais_FornecedorId",
                table: "NotasFiscais",
                column: "FornecedorId");

            migrationBuilder.CreateIndex(
                name: "IX_NotasFiscais_RequisicaoDeCompraId",
                table: "NotasFiscais",
                column: "RequisicaoDeCompraId");

            migrationBuilder.CreateIndex(
                name: "IX_Projetos_OrdemDeInvestimentoId",
                table: "Projetos",
                column: "OrdemDeInvestimentoId");

            migrationBuilder.CreateIndex(
                name: "IX_RequisicoesDeCompra_AtivoId",
                table: "RequisicoesDeCompra",
                column: "AtivoId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumosFinanceiros_OrdemDeInvestimentoId",
                table: "ResumosFinanceiros",
                column: "OrdemDeInvestimentoId");

            migrationBuilder.CreateIndex(
                name: "IX_Tarefas_ProjetoId",
                table: "Tarefas",
                column: "ProjetoId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Atividades");

            migrationBuilder.DropTable(
                name: "Documentos");

            migrationBuilder.DropTable(
                name: "NotasFiscais");

            migrationBuilder.DropTable(
                name: "ResumosFinanceiros");

            migrationBuilder.DropTable(
                name: "Tarefas");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Vinculos");

            migrationBuilder.DropTable(
                name: "Fornecedores");

            migrationBuilder.DropTable(
                name: "RequisicoesDeCompra");

            migrationBuilder.DropTable(
                name: "Projetos");

            migrationBuilder.DropTable(
                name: "Ativos");

            migrationBuilder.DropTable(
                name: "CentrosDeCusto");

            migrationBuilder.DropTable(
                name: "OrdensDeInvestimento");
        }
    }
}
