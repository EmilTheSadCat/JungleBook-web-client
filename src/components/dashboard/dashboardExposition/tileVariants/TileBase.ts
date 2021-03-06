import { Component, Prop, Vue } from 'vue-property-decorator';
import user, { PlantActionType } from '@/store/modules/user';
import settings from '@/store/modules/settings';
import { Plant } from '@/api/types';
import { formatDays, imageStoragePath } from '@/utils/format';
const uuidv4 = require('uuid').v4;
import { getDefaultPlantImage } from '@/utils/constants';

@Component({
    name: 'TileBase',
})
export default class TileBase extends Vue {
    @Prop() readonly plant!: Plant;

    addPlantKey = this.uniqueKey();
    formatDays = formatDays;

    get isSelectionMode() {
        return settings.isSelectionMode;
    }

    get imgPath() {
        if (!this.plant.avatar_image) {
            return getDefaultPlantImage();
        }
        return imageStoragePath(this.plant.avatar_image);
    }

    get isSelected() {
        return settings.currentlySelected.includes(this.plant.id);
    }

    set isSelected(on: boolean) {
        if (this.isSelected) {
            !on && settings.REMOVE_FROM_SELECTION(this.plant.id);
        } else {
            on && settings.ADD_TO_SELECTION(this.plant.id);
        }
    }

    get shouldBeWatered() {
        return this.plant.should_be_watered;
    }

    uniqueKey() {
        return uuidv4();
    }

    handleButtonDew(plantId: number) {
        user.actionPlant({
            data: { plant_ids: [plantId] },
            plantActionType: PlantActionType.DEW,
        }).then(() => {
            user.fetchUserData();
        });
    }

    handleButtonWater(plantId: number) {
        user.actionPlant({
            data: { plant_ids: [plantId] },
            plantActionType: PlantActionType.WATER,
        }).then(() => {
            user.fetchUserData();
        });
    }

    handleButtonDetails(plantId: number) {
        this.$router.push(`/plant/${plantId}`);
    }

    handleAddPlant() {
        this.$router.push('plant/add');
    }
}
