function hook() {
    function addIguaValuesToEntity(entity) {
        if (!entity.values.find(({ name }) => name === 'name'))
            entity.values.push({
                "name": "name",
                "definition": "String",
                "display": 0,
                "defaults": "",
                "maxLength": 0,
                "trimWhitespace": true
            });
        if (!entity.values.find(({ name }) => name === 'depth'))
            entity.values.push({
                "name": "depth",
                "definition": "Integer",
                "display": 0,
                "defaults": 0,
                "bounded": false,
                "min": -100,
                "max": 100
            });
    }

    return {
        beforeSaveProject: (project, data) => {
            data.entities.forEach(addIguaValuesToEntity);
            return data;
        },
    }
}

hook();
