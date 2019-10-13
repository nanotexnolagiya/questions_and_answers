<template>
  <pageLayout>
    <div class="d-flex">
      <form class="col-sm-4">
        <div class="form-group">
          <textarea class="form-control" rows="7" placeholder="Добавить заявку"></textarea>
        </div>
        <div class="form-group">
          <div class="custom-file">
            <input type="file" class="custom-file-input" id="customFile">
            <label class="custom-file-label" for="customFile">Выбрать файл</label>
          </div>
        </div>
        <button type="submit" class="btn btn-success">Сохранить</button>
      </form>
    </div>
  </pageLayout>
</template>

<script>
export default {}
</script>