export class AutomationList extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.api.ApplicationV2<
        foundry.applications.ApplicationConfiguration,
        foundry.applications.api.HandlebarsRenderOptions,
        foundry.applications.ApplicationRenderContext
    >
) {
    static override DEFAULT_OPTIONS = {
        id: "automation-list",
        tag: "form",
        window: {
            contentClasses: ["standard-form"],
            title: "PF2e Assistant - Automation List"
        },
        position: {
            width: 480,
            height: 500
        },
        form: {
            closeOnSubmit: true,
            handler: AutomationList.#onSubmit
        },
        actions: {
            toggle: AutomationList.#onToggle
        }
    };

    static override PARTS = {
        form: {
            template: "modules/pf2e-assistant/templates/apps/automation-list.hbs",
            templates: [
                "modules/pf2e-assistant/templates/apps/automation-file.hbs",
                "modules/pf2e-assistant/templates/apps/automation-folder.hbs"
            ],
            scrollable: [""]
        },
        footer: {
            template: "templates/generic/form-footer.hbs"
        }
    };

    protected override async _prepareContext(_options: fa.ApplicationRenderOptions) {
        return {
            rootFolder: game.assistant.storage.getRootFolder(),
            buttons: [{ type: "submit", icon: "fa-solid fa-save", label: "Save Changes" }]
        };
    }

    static async #onSubmit(_event: Event | SubmitEvent, form: HTMLFormElement, _formData: fa.ux.FormDataExtended) {
        const disabledFiles: string[] = [];

        const inputs = form.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            if (input.type === "checkbox" && input.checked === false) {
                disabledFiles.push(input.name);
            }
        }

        if (!disabledFiles.equals(game.settings.get("pf2e-assistant", "disabledFiles"))) {
            await game.settings.set("pf2e-assistant", "disabledFiles", disabledFiles);
            foundry.applications.settings.SettingsConfig.reloadConfirm({ world: true });
        }
    }

    static async #onToggle(_event: PointerEvent, target: HTMLElement) {
        const caret = target.querySelector("i");
        if (caret) {
            caret.classList.toggle("fa-caret-right");
            caret.classList.toggle("fa-caret-down");
        }

        const nested = target.parentElement?.querySelector<HTMLElement>(".assistant-nested");
        if (nested) {
            if (caret?.classList.contains("fa-caret-down")) {
                nested.style.removeProperty("display");
            }

            if (caret?.classList.contains("fa-caret-right")) {
                nested.style.display = "none";
            }
        }
    }
}
