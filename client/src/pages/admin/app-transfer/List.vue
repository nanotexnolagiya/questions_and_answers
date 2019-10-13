<template>
  <pageLayout>
    <div class="content-actions mb-3">
      <router-link to="/application-transfer/create" class="btn btn-success" tag="button">Добавить заявку</router-link>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Картина</th>
            <th scope="col">Подробно</th>
            <th scope="col">Статус</th>
            <th scope="col">Действии</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="https://images.unsplash.com/photo-1568069427790-346e73309008?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ" alt="">
            </td>
            <td>Lorem ip sum doler is ammet. Lorem ip sum doler is ammet. Lorem ip sum doler is ammet.</td>
            <td>Publish</td>
            <td>
              <div class="d-flex">
                <a href="">
                  <i class="fas fa-edit text-warning"></i>
                </a>
                <a href="">
                  <i class="fas fa-trash text-danger"></i>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </pageLayout>
</template>

<script>
export default {}
</script>