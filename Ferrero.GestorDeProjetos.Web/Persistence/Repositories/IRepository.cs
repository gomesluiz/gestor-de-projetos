using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Repositories
{
    /// <summary>
    /// Interface para os repositórios.
    /// </summary>
    public interface IRepository<TEntity> where TEntity : class
    {
        void Add(TEntity entity);
        void Remove (TEntity entity);
        TEntity Get(int id);
        IEnumerable<TEntity> GetAll();
        IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);
    }
}