(config => {
    if (!/^https:\/\/github.com\/.*\/.*\/labels/.test(location.href)) {
        throw new Error('the current page is not GitHub nor labels page. please go to github.com/yourusername/somerepository/labels and try again.');
    }

    const new_label_selector = '.js-details-target-new-label'
    if (!document.querySelector(new_label_selector)) {
        throw new Error('the current page has no "New Label" button. check that you have some relevant permissions to manage it.');
    }

    if (typeof config !== 'object') {
        throw new Error('the config argument is not an object.');
    }

    {
        const available_config_keys = ['labels', 'delete_all_labels'];
        const unexpected_config_keys = Object.keys(config).filter(key => {
            return !available_config_keys.includes(key);
        });
        if (unexpected_config_keys.length > 0) {
            throw new Error(`the config argument has unexpected keys: ${unexpected_config_keys}`);
        }
    }

    if (config.delete_all_labels) {
        for (const label_box of document.querySelectorAll('div.Box-row')) {
            label_box.querySelector('div:nth-child(4) > div:nth-child(1) > form:nth-child(2) > button:nth-child(3)').click();
        }
    }
    
    if (config.labels) {
        for (const label of config.labels) {
            const available_label_keys = ['name', 'description', 'color'];
            const unexpected_label_keys = Object.keys(label).filter(key => {
                return !available_label_keys.includes(key);
            });
            if (unexpected_label_keys.length > 0) {
                throw new Error(`the "${label.name}" label has unexpected keys: ${unexpected_label_keys}`);
            }

            if (!/^#[0-9a-fA-F]{6}$/.test(label.color)) {
                throw new Error(`the "${label.color}" color is not a valid. the valid form is #xxxxxx (where each x is a hexadecimal digit.)`);
            }

            document.querySelector(new_label_selector).click();

            document.querySelector('#label-name-').value = label.name;
            document.querySelector('#label-description-').value = label.description;
            document.querySelector('#label-color-').value = label.color;

            const create_label_selector = 'div.clearfix:nth-child(4) > div:nth-child(4) > button:nth-child(2)';
            document.querySelector(create_label_selector).removeAttribute('disabled');
            document.querySelector(create_label_selector).click();
        }
    }
    
    console.log('done.');
})({
    labels: [
        { name: ':bug: bug', description: '', color: '#ee0701' },
        { name: ':lock: security', description: '', color: '#ee0701' },
        { name: ':speech_balloon: discussion', description: '', color: '#cc317c' },
        { name: ':scroll: rfc', description: '', color: '#cc317c' },
        { name: ':grey_question: question', description: '', color: '#cc317c' },
        { name: ':wrench: enhancement', description: '', color: '#84b6eb' },
        { name: ':four_leaf_clover: optimization', description: '', color: '#84b6eb' },
        { name: ':factory: feature', description: '', color: '#0e8a16' },
        { name: ':horse_racing: in progress', description: '', color: '#fbca04' },
        { name: 'invalid', description: '', color: '#dddddd' },
        { name: 'wontfix', description: '', color: '#dddddd' },
        { name: 'duplicate', description: '', color: '#dddddd' },
        { name: 'on hold', description: '', color: '#dddddd' },
    ],

    delete_all_labels: true,
});
