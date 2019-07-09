
using System;
using Moq;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Ferrero.GestorDeProjetos.Web.Persistence.Repositories;

namespace Ferrero.GestorDeProjetos.Tests
{
    public class DummyClass
    {
        public int Id { get; set;}
    }
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            // Arrange 
            var dummy       = new DummyClass();
            var context     = new Mock<DbContext>();
            var dbSetMock   = new Mock<DbSet<DummyClass>>();
            context.Setup(x => x.Set<DummyClass>()).Returns(dbSetMock.Object);
            //dbSetMock.Setup(x => x.Add(It.IsAny<dummy>())).Returns(dummy);

            // Act 
            var repository = new Repository<DummyClass>(context.Object);
            repository.Add(dummy);

            // Assert
            context.Verify(x => x.Set<DummyClass>());
            dbSetMock.Verify(x => x.Add(It.Is<DummyClass>(y => y == dummy)));

        }
    }
}
